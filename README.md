Summary:

    The app is a photo storage app. Activities includes creating new users, authenticating log ins, uploading photos and viewing previously uploaded photos.

    Live website address: http://app-dcj.s3-website.eu-west-2.amazonaws.com

    todo: 
        -   Unit/Integration testing, 
        -   Writing a CloudFormation script
        -   Allowing photos to be deleted
        -   Allowing metadata/tags to be attached to photos
        -   Sorting/Filtering photos
        -   Improved caching
        -   Better fail case handling
        -   CI/CD for AWS resources (SAM/CloudFormation)

Resources:

    1 Dynamodb,
    1 RDS database,
    1 Elasticache layer - Redis,
    6 Lambda functions
        -   Lambdas exist inside the default VPC with a NAT gateway to access public resources
        -   3 Subnets to the default vpc
    2 Secret Manager keys
        -   RDS access details
        -   JWT secret key
    5 SMS Parameter keys
        -   Image bucket location
        -   RDS host name
        -   RDS table name
        -   Redis end point
        -   Redis port
    2 SQS queues
        -   Dead letter queue
        -   Photo transfer buffer
    2 SNS
        -   Error alert
        -   Build notification
    1 CodePipeline
        -   CodeBuild
        -   CodeDeploy
    1 Git hub repo
    2 S3 Buckets
        -   Image store
        -   Static website
    1 API gateway
    Various IAM roles


Routes:

    Create user
        -   API Gateway calls
        -   Lambda calls
            -   RDS database to check available username and to create a new user
            -   Secret Manager store to get RDS access details
            -   Parameter store to get RDS access details
        -   API Gateway

    Auth user
        -   API Gateway calls
        -   Lambda calls
            -   RDS database to check credentials
            -   Secret Manager store to get RDS access details
            -   Parameter store to get RDS and redis access details,
            -   Redis to store sessions
        -   API Gateway

    Auth token
        -   API Gateway calls
        -   Lambda calls
            -   RDS database to check available username and to create a new user
            -   Secret Manager store to get RDS access details
        -   API Gateway     

    Get photos
        -   Requires auth_token for access
        -   API Gateway calls
        -   Lambda calls
            -   Dynambodb to get photos available to the user
            -   Secret Manager store to get JWT secret key
        -   API Gateway

    Get presigned url
        -   Requires auth_token for access
        -   API Gateway calls
        -   Lambda calls
            -   S3 to create a presigned url to allow direct uploading
            -   Secret Manager store to get JWT secret key
        -   API Gateway

    Transfer photos
        -   S3 event triggers on POST
        -   SQS acts as buffer to store S3 events
        -   Lambda polls SQS
        -   Lambda calls
            -   Dynamodb to write new entries
