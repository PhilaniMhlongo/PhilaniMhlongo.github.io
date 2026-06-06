from datetime import date
def get_role():
  return {
    "title": "DevOps Engineer Intern",
    "Company": "Old Mutual",
    "team": "Platform / OIPA Centre of Excellence",
    "total_xp": "Oct 2025 – Present"
  }

def get_stack():
  return [
     "AWS",           # cloud infrastructure
      "EKS",           # managed Kubernetes on AWS
      "Kubernetes",    # container orchestration
      "Azure DevOps",  # CI/CD pipelines
      "MSSQL",         # database management
      "OIPA",          # insurance platform
  ]

def get_wins():
  return [
      "Built and maintained CI/CD pipelines in Azure DevOps for OIPA platform deployments",
      "Managed EKS clusters across 8 environments, maintaining 99% uptime",
      "Automated deployment pipeline — reduced release time by 12 minutes per deploy",
      "Monitored infrastructure using AWS CloudWatch, resolved 23 incidents within SLA",
      "Wrote Bash/Python scripts to automate repetitive ops tasks, saving ~10 hours/week",
      "Performed MSSQL database maintenance and supported OIPA platform operations",
    ]

