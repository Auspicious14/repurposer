import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';


export async function getAuthenticatedUser(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // Optionally fetch full user data from database here
    return {
      id: decoded.userId,
      email: decoded.email,
      // other user fields
    };
  } catch {
    return null;
  }
}


export function withOptionalAuth(getServerSidePropsFunc?: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    const user = await getAuthenticatedUser(context);
    
    let additionalProps = {};
    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      if ('props' in result) {
        additionalProps = result.props;
      }
    }
    
    return {
      props: {
        user,
        ...additionalProps,
      },
    };
  };
}
