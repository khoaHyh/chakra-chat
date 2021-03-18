import AuthForm from './AuthForm';

const MapForms = ({ forms }) => {
  return forms.map((elem, i) => {
    return (
      <AuthForm key={i} legend={forms[i].legend} action={forms[i].action} />
    );
  });
};

export default MapForms;
