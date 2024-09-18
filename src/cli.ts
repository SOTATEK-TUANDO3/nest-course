import { CommandFactory } from 'nest-commander';
import { CommandModule } from './modules/commands/command.module';

async function bootstrap() {
  await CommandFactory.run(CommandModule, ['warn', 'error']);
}
bootstrap();
