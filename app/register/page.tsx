

import getCurrentUser from "@/actions/getCurrentUser";
import FormWrap from "../components/FormWrap";
import Container from "../components/nav/Container";
import RegisterForm from "./RegisterForm";

const Register = async () => {
  const currentUser = await getCurrentUser();

  return (
    <Container>
      <FormWrap>
        <RegisterForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

export default Register;