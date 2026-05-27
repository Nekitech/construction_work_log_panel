import type { ArgumentsHost } from '@nestjs/common'
import { Catch, HttpStatus } from '@nestjs/common'
import type { ExceptionFilter } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()

    if (exception.code === 'P2003') {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Referenced record does not exist',
        error: 'Bad Request',
      })
    }

    if (exception.code === 'P2025') {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: 'Record not found',
        error: 'Not Found',
      })
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    })
  }
}
