resource "kubectl_manifest" "configmap" {
  depends_on = [kubernetes_namespace.lanchonete_ns]
  yaml_body  = <<YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-configmap
  namespace: tc4-order
data:
  NODE_TLS_REJECT_UNAUTHORIZED: "0"
  ITEM_SERVICE_URL: "${var.item_service_url}"
  CUSTOMER_SERVICE_URL: "${var.customer_service_url}"
  PAYMENT_SERVICE_URL: "${var.payment_service_url}"

YAML
}