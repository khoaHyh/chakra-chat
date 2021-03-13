import Credentials from "./Credentials";

const Forms = ({ forms }) => {
  return forms.map((elem, i) => {
    return (
      <Credentials
        legend={forms[i].legend}
        action={forms[i].action}
        value={forms[i].value}
      />
    );
  });
};
