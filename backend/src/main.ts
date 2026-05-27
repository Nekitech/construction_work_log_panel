import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Construction Work Log API')
    .setDescription('API for managing construction site work log entries')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  if (process.env.GENERATE_SCHEMA === 'true') {
    const schemaPath = path.resolve(__dirname, '../../schema/openapi.json')
    fs.mkdirSync(path.dirname(schemaPath), { recursive: true })
    fs.writeFileSync(schemaPath, JSON.stringify(document, null, 2))
    console.log(`OpenAPI schema written to ${schemaPath}`)
    await app.close()
    return
  }

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`Backend running on http://localhost:${port}`)
  console.log(`Swagger UI: http://localhost:${port}/api`)
}

bootstrap()
