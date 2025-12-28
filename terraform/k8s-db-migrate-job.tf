resource "kubectl_manifest" "db_migrate_job" {
  depends_on = [kubectl_manifest.secrets, kubectl_manifest.configmap]
  yaml_body  = <<YAML
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate-seed-job
  namespace: tc4-order
spec:
  template:
    spec:
      containers:
      - name: tc4-order-migrate-db
        image: danielaqueiroz/tc4-order:latest
        imagePullPolicy: IfNotPresent
        command: ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]
        envFrom:
        - configMapRef:
            name: api-configmap
        - secretRef:
            name: api-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
      restartPolicy: Never
  backoffLimit: 4

YAML
}