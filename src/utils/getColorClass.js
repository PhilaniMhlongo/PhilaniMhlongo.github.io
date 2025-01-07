const getColorClass = (tech) => {
  switch (tech) {
    case "#JavaScript":
      return "javascript";
    case "#TypeScript":
      return "typescript";
    case "#HTML":
      return "html";
    case "#CSS":
      return "css";
    case "#Git":
      return "git";
    case "#Node.js":
      return "nodejs";
    case "#Express.js":
      return "expressjs";
    case "#MongoDB":
      return "mongodb";
    case "#PostgreSQL":
      return "postgresql";
    case "#Next.js":
      return "nextjs";
    case "#Firebase":
      return "firebase";
    case "#Jest":
      return "jest";
    case "#CI/CD":
      return "cicd";
    case "#AdobeXD":
      return "adobe-xd";
    case "#React.js":
      return "reactjs";
    case "#JWT":
      return "jwt";
    case "#Strapi":
      return "strapi";
    case "#MUI":
      return "mui";
    case "#Java":
      return "java";
    case "#Docker":
      return "docker";
    case "#Flutter":
      return "flutter";
    case "#Dart":
      return "dart";
    case "#AWS Lambda":
      return "aws-lambda";
    case "#API Gateway":
      return "api-gateway";
    case "#DynamoDB":
      return "dynamodb";
    case "#AWS SAM":
      return "aws-sam";
    case "#CloudFormation":
      return "cloudformation";
    case "#IaC":
      return "iac";
    case "#VPC":
      return "vpc";
    case "#EC2":
      return "ec2";
    case "#RDS":
      return "rds";
    case "#EFS":
      return "efs";
    case "#ALB":
      return "alb";
    case "#IAM":
      return "iam";
    default:
      return "";
  }
};

export default getColorClass;
