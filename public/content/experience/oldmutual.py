"""Old Mutual Africa Regions (OMAR) — OIPA Centre of Excellence.

Global Capability Hub, Durban, South Africa.
"""

from datetime import date


def get_role():
    return {
        "title": "DevOps Engineer",
        "company": "Old Mutual Africa Regions (OMAR)",
        "team": "OIPA Centre of Excellence, Global Capability Hub",
        "location": "Durban, South Africa",
        "started": date(2025, 10, 1),
        "markets": ["Malawi", "Botswana", "Zimbabwe", "Kenya", "Uganda"],
    }


def get_stack():
    return [
        "AWS",              # EC2, EKS, Lambda, S3, RDS, IAM, SSM, API Gateway
        "EKS",              # self-hosted Azure DevOps agent pool
        "Systems Manager",  # cross-account Run Command execution
        "Azure DevOps",     # pipelines, shared templates, PR governance
        "CloudFormation",   # serverless service deployment
        "WSO2",             # API Manager, apictl, Spectral linting
        "Oracle OIPA",      # policy administration platform
        "PowerShell",       # Windows production automation
        "SQL Server",       # OIPA data layer
    ]


def get_wins():
    return [
        # Deployment control plane — the headline result
        "Designed a centralised deployment control plane across three AWS "
        "accounts: self-hosted Azure DevOps agents on EKS invoke SSM Run "
        "Command against Dev and QA EC2 targets, replacing 45 minutes of "
        "manual OIPA deployment steps with an automated run under 3 minutes",

        "Modelled cross-account IAM roles and SSM connectivity so one EKS "
        "agent pool serves every environment — removing per-account agent "
        "infrastructure while enforcing least privilege",

        # Serverless services
        "Built a serverless report-distribution service (API Gateway, Lambda, "
        "S3, CloudFormation) issuing HMAC-SHA256 signed links that mint "
        "presigned S3 URLs at click time, solving link expiry caused by STS "
        "session limits — shipped for Malawi as a reusable template",

        "Migrated monthly OIPA valuation-report distribution from an "
        "on-premises SMTP server to Amazon S3, cutting recurring cost and "
        "improving retention, auditability and access control",

        "Built an ACM certificate-expiry notification system, turning a "
        "recurring silent outage risk into scheduled, actionable alerts",

        # Pipeline consolidation
        "Consolidated eight Azure DevOps pipelines into four using shared "
        "templates for OpenAPI deployments to WSO2 API Manager, with PR "
        "governance, git-diff change detection, Spectral linting and "
        "apictl-driven promotion across environments",

        "Automated archival of OIPA reports and logs from Windows production "
        "servers to S3 with PowerShell and the AWS CLI, eliminating the "
        "disk-capacity exhaustion that had been failing processing cycles",

        # Incident work
        "Led diagnosis of a production RDS incident — sustained CPU "
        "saturation, deadlocks, failed OIPA cycles and actuarial reporting "
        "discrepancies — identifying a concurrency rather than capacity root "
        "cause, and produced a reusable evidence-led diagnostic runbook",

        "Resolved recurring Oracle Rules Palette and OIPA environment faults: "
        "JVM SSL truststore misconfiguration, AES credential decryption "
        "failures after a JDK change, and JVM heap tuning for large rule sets",

        "Hardened PowerShell cycle-output mailer scripts for Zimbabwe "
        "production, and supported OIPA and Rules Palette UAT and production "
        "releases across all five markets",
    ]
