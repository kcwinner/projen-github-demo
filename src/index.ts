import * as fs from 'fs-extra'; // eslint-disable-line
import * as path from 'path'; // eslint-disable-line
import { AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions, Component, SampleDir } from 'projen';
import { pascalCase } from './pascalCase';

export interface AwsCdkAppSyncAppOptions extends AwsCdkTypeScriptAppOptions {
}

/**
 * Demo Project in TypeScript
 *
 * @pjid demo-project
 */
export class DemoProject extends AwsCdkTypeScriptApp {
  public readonly projectName: string;

  constructor(options: AwsCdkAppSyncAppOptions) {
    super({
      ...options,
      sampleCode: false,

      // Custom project stuff
      licensed: false, // example: our private package is unlicensed because its org internal
    });

    this.projectName = path.basename(process.cwd());

    console.log('## Options:', options);

    if (options.sampleCode ?? true) {
      new SampleCode(this);
    }
  }
}

class SampleCode extends Component {
  private readonly demoProject: DemoProject;
  private readonly devAccount = '111111111111';
  private readonly prodAccount = '222222222222'

  constructor(project: DemoProject) {
    super(project);
    this.demoProject = project;
  }

  public synthesize() {
    console.log('## Synthesizing Demo Project ##');
    const srcdir = path.join(this.project.outdir, this.demoProject.srcdir);

    console.log('### Src Dir:', srcdir);

    // Check if ts files exist. If so, do NOT create sample code
    if (fs.pathExistsSync(srcdir) && fs.readdirSync(srcdir).filter(x => x.endsWith('.ts'))) {
      return;
    }

    const projectType = pascalCase(this.demoProject.projectName);

    console.log('### Project Type:', projectType);

    new SampleDir(this.demoProject, srcdir, {
      files: {
        'main.ts': this.createMainTsContents(this.demoProject.projectName, projectType),
      },
    });

    const libDir = path.join(srcdir, 'lib');
    new SampleDir(this.demoProject, libDir, {
      files: {
        [`${this.demoProject.projectName}-stack.ts`]: this.projectStackContents(this.demoProject.projectName, projectType),
      },
    });

    const testCode = `import '@aws-cdk/assert/jest';
import { ${projectType}Stack } from '../src/lib/${this.demoProject.projectName}-stack'
import { PipelineStack } from '../src/lib/pipeline-stack'
import { App } from '@aws-cdk/core';
test('Basic Test', () => {
  const app = new App();
  const stack = new ${projectType}Stack(app, 'test');
  expect(stack).toHaveResource('AWS::SNS::Topic');
});`;

    const testdir = path.join(this.project.outdir, this.demoProject.testdir);
    new SampleDir(this.demoProject, testdir, {
      files: {
        'main.test.ts': testCode,
      },
    });
  }

  private createMainTsContents(projectName: string, projectType: string): string {
    return `import { App } from '@aws-cdk/core';
import { ${projectType} } from './lib/${projectName}-stack';
import { PipelineStack } from './lib/pipeline-stack';
const DEV_ACCOUNT = '${this.devAccount}';
const PROD_ACCOUNT = '${this.prodAccount}';
const STAGE = process.env.STAGE || 'dev'; // default to dev as the stage
const ACCOUNT = process.env.ACCOUNT || '${this.devAccount}'; // default to dev account
const REGION = process.env.REGION || 'us-east-2'; // default region we are using
const app = new App(
  {
    context: {
      STAGE: STAGE,
      ACCOUNT: ACCOUNT,
      REGION: REGION,
      DEV_ACCOUNT: DEV_ACCOUNT,
      PROD_ACCOUNT: PROD_ACCOUNT,
    },
  },
);

new ${projectType}(app, \`${projectName}-\${STAGE}\`, {
  terminationProtection: true,
  description: 'Stack for ${projectName}',
  env: {
    account: ACCOUNT,
    region: REGION,
  },
});
app.synth();`;
  }

  private projectStackContents(projectName: string, projectType: string): string {
    return `import * as path from 'path';
import { Construct, Stack, StackProps, Duration } from '@aws-cdk/core';
import { Topic } from '@aws-cdk/aws-sns';
import { EmailSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { Alarm } from '@aws-cdk/aws-cloudwatch';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';

export interface ${projectType}StackProps extends StackProps { }

const errorNotificationEmails = ['youremail@org.com'];

export class ${projectType}Stack extends Stack {
  constructor(scope: Construct, id: string, props?: ${projectType}StackProps) {
    super(scope, id, props);
    const STAGE = this.node.tryGetContext('STAGE');
    const errorNotificationTopic = new Topic(this, '${projectName}-error-notification-topic', {
      displayName: \`${projectName}-error-notification-topic-\${STAGE}\`,
      topicName: \`${projectName}-error-notification-topic-\${STAGE}\`,
    });
    errorNotificationEmails.forEach(email => {
      errorNotificationTopic.addSubscription(new EmailSubscription(email));
    });
  }
}`;
  }

}