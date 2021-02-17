const env = process.env.NODE_ENV || 'developemnt'
const credentials=require(`./.credentials.${env}`)
module.exports={ credentials }
