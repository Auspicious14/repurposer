import { ResetPasswordPage } from "@/modules/auth/resetPassword/page"
import { GetServerSideProps } from "next"

interface IProps {
  token: string 
}
export default function ResetPassword({token}: IProps) {
return (
  <ResetPasswordPage token={token} />
)
}

export const getServerSideProps: GetServerSideProps<ResetProps> = async (context) => {
  const { query } = context;
  const token = query.token as string | undefined;

  if (!token) {
    return {
      props: { error: "Invalid reset link" },
    };
  }

  return {
    props: { token },
  };
};
