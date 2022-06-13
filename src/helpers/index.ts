import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALTWORKFACTOR));
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    console.log(error);
  }
}

export const jsonResponse = (error: boolean, message: string, data?: any) => {
  return {
    "result": {
      error,
      data,
      message
    }
  }
}