# Cloudflare KV Namespaces
resource "cloudflare_workers_kv_namespace" "sessions" {
  account_id = var.cloudflare_account_id
  title      = "${var.environment}-sessions"
}

resource "cloudflare_workers_kv_namespace" "cache" {
  account_id = var.cloudflare_account_id
  title      = "${var.environment}-cache"
}

# Cloudflare D1 Database
resource "cloudflare_d1_database" "main" {
  account_id = var.cloudflare_account_id
  name       = "${var.environment}-bearbuddy-db"
}

# Cloudflare R2 Bucket
resource "cloudflare_r2_bucket" "assets" {
  account_id = var.cloudflare_account_id
  name       = "${var.environment}-assets"
  location   = "auto"
}

# Cloudflare Worker Script
resource "cloudflare_worker_script" "api" {
  account_id = var.cloudflare_account_id
  name       = "${var.environment}-bearbuddy-api"
  content    = file("${path.module}/../../../cloudflare/dist/index.js")

  kv_namespace_binding {
    name         = "SESSIONS"
    namespace_id = cloudflare_workers_kv_namespace.sessions.id
  }

  kv_namespace_binding {
    name         = "CACHE"
    namespace_id = cloudflare_workers_kv_namespace.cache.id
  }

  r2_bucket_binding {
    name        = "ASSETS"
    bucket_name = cloudflare_r2_bucket.assets.name
  }

  d1_database_binding {
    name        = "DB"
    database_id = cloudflare_d1_database.main.id
  }
}

# Cloudflare Worker Route
resource "cloudflare_worker_route" "api" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.environment}.api.${var.domain_name}/*"
  script_name = cloudflare_worker_script.api.name
}
