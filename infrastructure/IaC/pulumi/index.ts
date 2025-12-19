import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

const config = new pulumi.Config();
const environment = config.require("environment");
const accountId = config.require("cloudflareAccountId");

// KV Namespaces
export const sessionsNamespace = new cloudflare.WorkersKvNamespace("sessions", {
  accountId: accountId,
  title: `${environment}-sessions`,
});

export const cacheNamespace = new cloudflare.WorkersKvNamespace("cache", {
  accountId: accountId,
  title: `${environment}-cache`,
});

// D1 Database
export const database = new cloudflare.D1Database("main", {
  accountId: accountId,
  name: `${environment}-bearbuddy-db`,
});

// R2 Bucket
export const assetsBucket = new cloudflare.R2Bucket("assets", {
  accountId: accountId,
  name: `${environment}-assets`,
  location: "auto",
});

// Worker Script
export const workerScript = new cloudflare.WorkerScript("api", {
  accountId: accountId,
  name: `${environment}-bearbuddy-api`,
  content: pulumi.asset.FileAsset("../../../cloudflare/dist/index.js"),
  kvNamespaceBindings: [
    {
      name: "SESSIONS",
      namespaceId: sessionsNamespace.id,
    },
    {
      name: "CACHE",
      namespaceId: cacheNamespace.id,
    },
  ],
  r2BucketBindings: [
    {
      name: "ASSETS",
      bucketName: assetsBucket.name,
    },
  ],
  d1DatabaseBindings: [
    {
      name: "DB",
      databaseId: database.id,
    },
  ],
});

// Exports
export const workerUrl = pulumi.interpolate`https://${workerScript.name}.workers.dev`;
export const sessionsNamespaceId = sessionsNamespace.id;
export const cacheNamespaceId = cacheNamespace.id;
export const databaseId = database.id;
export const bucketName = assetsBucket.name;
