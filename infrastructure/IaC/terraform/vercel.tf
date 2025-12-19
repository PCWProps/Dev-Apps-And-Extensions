# Vercel Project
resource "vercel_project" "main" {
  name      = "bearbuddy-${var.environment}"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "PCWProps/Dev-Apps-And-Extensions"
  }

  environment = [
    {
      key    = "NODE_ENV"
      value  = var.environment == "production" ? "production" : "development"
      target = ["production", "preview"]
    },
    {
      key    = "API_BASE_URL"
      value  = "https://${var.environment}.api.${var.domain_name}"
      target = ["production", "preview"]
    },
  ]
}

# Vercel Domain
resource "vercel_project_domain" "main" {
  project_id = vercel_project.main.id
  domain     = "${var.environment == "production" ? "" : "${var.environment}."}${var.domain_name}"
}
