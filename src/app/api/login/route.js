import dbConnect from '../../../libs/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Exporta una función con nombre para manejar el método POST
export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

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

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error('Error en la API de login:', error);
    return new Response(JSON.stringify({ message: 'Error en el servidor' }), { status: 500 });
  }
}
