import { InjectRepository } from '@nestjs/typeorm';
import { Question, QuestionSet } from 'nest-commander';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import Validator from 'validatorjs';

@QuestionSet({ name: 'create-admin-questions' })
export class CreateAdminQuestions {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  @Question({
    type: 'input',
    message: 'Please enter your email:',
    name: 'email',
    validate: async function (email: string) {
      let rules = {
        email: 'required|string|email',
      };
      let validation = new Validator({ email: email }, rules);
      if (validation.fails()) {
        const firstErrors = validation.errors.first('email');
        console.log(`\n${firstErrors}`);

        return false;
      }
      const hasAccount = await this.userRepo.findOneBy({ email: email.trim() });
      if (hasAccount) {
        console.log('\nEmail already exist.');

        return false;
      }

      return true;
    },
  })
  parseEmail(email: string) {
    return email;
  }

  @Question({
    type: 'password',
    message: 'Please enter your password:',
    name: 'password',
    validate: function (password: string) {
      Validator.register(
        'checkPassword',
        function (value) {
          return value.match(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/);
        },
        'Password too weak.',
      );
      let rules = {
        password: 'required|string|min:8|max:64|checkPassword',
      };

      let validation = new Validator({ password: password }, rules);
      if (validation.fails()) {
        const firstErrors = validation.errors.first('password');
        console.log(`\n${firstErrors}`);
        return false;
      }

      return true;
    },
  })
  parsePw(password: string) {
    return password;
  }
}
