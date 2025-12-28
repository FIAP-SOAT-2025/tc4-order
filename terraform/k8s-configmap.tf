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
  ITEM_SERVICE_URL: "http://api-service.tc4-order.svc.cluster.local"
  CUSTOMER_SERVICE_URL: "http://api-service.tc4-order.svc.cluster.local"
  PAYMENT_SERVICE_URL: "http://api-service.tc4-order.svc.cluster.local"

YAML
}