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

let aws = new Aws(options);

aws
  .command(
    'ec2 describe-instances --filters "Name=tag:Name,Values=RobBot"' +
      ' --query "Reservations[].Instances[].[InstanceId, State.Name]" --output json'
  )
  .then((data) => {
    data = JSON.parse(data.raw);
    data.forEach((element) => {
      if (element[1] === "running") {
        aws.command(`ec2 terminate-instances --instance-ids ${element[0]}`);
      }
    });
  });
