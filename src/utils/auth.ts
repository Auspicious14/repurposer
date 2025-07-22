import jwt from "jsonwebtoken";
import { GetServerSidePropsContext, GetServerSideProps } from "next";

export async function getAuthenticatedUser(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // Optionally fetch full user data from database here
    return {
      id: decoded.id,
      // email: decoded.email,
      // other user fields
    };
  } catch {
    return null;
  }
}

export const withAuth = (getServerSidePropsFunc?: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const user = await getAuthenticatedUser(context);

    let additionalProps = {};
    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      if ("props" in result) {
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
};

// Helper for protected pages (redirect if not authenticated)
export const withProtectedAuth = (
  getServerSidePropsFunc?: GetServerSideProps
) => {
  return async (context: GetServerSidePropsContext) => {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    let additionalProps = {};
    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      if ("props" in result) {
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
};
