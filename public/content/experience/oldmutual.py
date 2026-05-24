"""
oldmutual.py

DevOps Internship Experience - Old Mutual
"""

role = "Junior DevOps Engineer Intern"
team = "Platform / OIPA CoE"
duration = "2025 - Present"

mentorship = [
    "Sakhile Masoka- Mentor",
    "Old mutual global capability hub"
]

technologies = [
    "AWS",
    "Kubernetes",
    "Azure Devops",
    "MSSQL"
]

achievements = [
    {
        "title": "CI/CD Pipeline Improvements",
        "impact": "Improved deployment reliability and reduced manual intervention in release processes."
    },
    {
        "title": "Infrastructure Automation",
        "impact": "Supported automation of infrastructure tasks using scripting and IaC principles."
    },
    {
        "title": "Production Support",
        "impact": "Assisted in troubleshooting incidents and improving system stability."
    },
    {
        "title": "Cloud Exposure",
        "impact": "Gained hands-on experience with AWS services in enterprise environments."
    }
]

soft_skills = [
    "Problem Solving",
    "Team Collaboration",
    "Incident Response",
    "Communication in Agile Teams"
]


def summary():
    return f"{role} | {team} | {duration}"


def impact():
    return [a["impact"] for a in achievements]


def reflect():
    return (
        "Built strong foundations in DevOps practices, cloud infrastructure, "
        "and real-world production systems."
    )



experience = {
    "summary": summary(),
    "technologies": technologies,
    "achievements": achievements,
    "reflection": reflect()
}