import dbConnect from '../../../libs/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Exporta una función con nombre para manejar el método POST
export async function POST(req) {
  await dbConnect();

  const { username, password } = await req.json(); // Usa await req.json() para obtener el body en Next.js 13

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Contraseña incorrecta' }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'tuClaveSecreta',
      { expiresIn: '1h' }
    );

    // Configura la cookie con el token
    return new Response(JSON.stringify({ message: 'Inicio de sesión exitoso' }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`, // Cookie válida por 1 hora
      },
    });
  } catch (error) {
    console.error('Error en la API de login:', error);
    return new Response(JSON.stringify({ message: 'Error en el servidor' }), { status: 500 });
  }
}