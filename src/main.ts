import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('tswc-api')
    .setDescription('Документация API tswc')
    .setVersion('0.3')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Сохраняет авторизацию при перезагрузке
      requestInterceptor: (req) => {
        const token = localStorage.getItem('swagger-auth-token'); // Получаем токен из localStorage
        if (token) {
          req.headers['Authorization'] = `Bearer ${token}`; // Добавляем токен в заголовок
        }
        return req;
      },
    },
    customJs: `
      // Сохраняем токен в localStorage после авторизации
      const authButton = document.querySelector('.swagger-ui .authorize');
      if (authButton) {
        authButton.addEventListener('click', () => {
          const tokenInput = document.querySelector('.swagger-ui .auth-container input');
          const saveButton = document.querySelector('.swagger-ui .auth-container .btn-done');
          if (tokenInput && saveButton) {
            saveButton.addEventListener('click', () => {
              const token = tokenInput.value;
              if (token) {
                localStorage.setItem('swagger-auth-token', token); // Сохраняем токен
              }
            });
          }
        });
      }
    `,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
