# SAAS for MMY fitment lookup integration in BigCommerce

- Kubernetes based deployement
- Leverages OpenSearch for efficient search with dynamic faceted filtering for huge ecommerce product catalog
- AI integration for conversational search response
- autoscales up or down based on traffic conditions
- supports over 10,000 api endpoint hits / second

kubectl delete configmap env-common
kubectl create configmap env-common --from-env-file=.env

kubectl delete configmap env-prod
kubectl create configmap env-prod --from-env-file=.env.production
