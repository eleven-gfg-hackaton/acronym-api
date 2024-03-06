# acronym-api

To deploy the `nodejs-http-function` using `gcloud`, run the following command:
gcloud functions deploy nodejs-http-function \
--gen2 \
--runtime=nodejs20 \
--region=us-central1 \
--source=. \
--entry-point=helloGET \
--trigger-http 