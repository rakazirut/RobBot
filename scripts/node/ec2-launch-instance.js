const awsCli = require("aws-cli-js");
const Options = awsCli.Options;
const Aws = awsCli.Aws;
const auth = require("../../auth.json");

let options = new Options(
  auth.aws.accessKey,
  auth.aws.secretKey,
  null,
  null,
  "aws"
);

let templateId = 'lt-0dd5918511adde591'
let aws = new Aws(options);

aws.command(
  `ec2 run-instances --launch-template LaunchTemplateId=${templateId}`
);
