output "cloudflare_worker_url" {
  description = "URL of the deployed Cloudflare Worker"
  value       = cloudflare_worker_script.api.*.name
}

output "vercel_project_url" {
  description = "URL of the Vercel project"
  value       = vercel_project.main.*.targets
}

output "kv_namespace_ids" {
  description = "IDs of created KV namespaces"
  value       = {
    sessions = cloudflare_workers_kv_namespace.sessions.id
    cache    = cloudflare_workers_kv_namespace.cache.id
  }
}

output "d1_database_id" {
  description = "ID of the D1 database"
  value       = cloudflare_d1_database.main.id
}
