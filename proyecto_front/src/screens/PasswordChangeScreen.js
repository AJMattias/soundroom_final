import React, {useEffect, useState} from 'react'
import { useRoute } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import Background from "../components/Background";
import Header from "../components/Header";
import Logo from "../components/Logo";
import { userService } from "../network/UserService";
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { getTokenLocalStorage } from '../storage/LocalStorage';
import { passwordValidator } from '../helpers/passwordValidator';
import Paragraph from '../components/Paragraph';


export default function PasswordChangeScreen({navigation}){
    const route = useRoute();
    //token para enviar al back para cambiar la contraseña
    //const token = route?.params?.token;
    console.log('token: ', token)
    const [password, setPassword] = useState({value:'', error:''})
    const [password2, setPassword2] = useState({value:'', error:''})
    const [token, setToken] = useState('')
    const [errorMessage, setErrorMessage ] = useState({error: ''})
    
    


    const changePassword = async () => {
      console.log('token, password: ', token, password.value);

      // Validar la contraseña
      const passwordError = passwordValidator(password.value);
      setErrorMessage({ error: '' });
      if (passwordError) {
          setPassword({ ...password, error: passwordError });
          return;
      }
      //validar contraseña 2
      const passwordError2 = passwordValidator(password2.value);
      setErrorMessage({ error: '' });
      if (passwordError2) {
          setPassword2({ ...password2, error: passwordError2 });
          return;
      }

       // Verificar si las contraseñas coinciden
       if (password.value !== password2.value) {
        setErrorMessage({ error: 'Las contraseñas no coinciden' });
        return;
      }

      try {
        const response = await userService.changePassword(token, password.value);
        console.log('response: ', response);
        if (response && response.user && response.token) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'UserProfileScreen2' }],
            });
        } 
      } catch (error) {
        console.error("Error al loguearnos")
        console.error(apiError)
        showApiError(apiError)
      }
     
  };

    // const changePassword = async () =>{
    //   const changePassword = await userService.changePassword(token, password.value)
    //   console.log('changePassword: ', changePassword)
    //   if(changePassword){
    //     navigation.reset({
    //       index: 0,
          
    //       routes: [{ name: 'UserProfileScreen2' }],
    //       //routes: [{ name: 'LoginScreen' }],
    //     });
    //   }
    // }

    useEffect(() => {
      setToken(getTokenLocalStorage())
      console.log('token: ', token)
    }, [])
    

    return(
        <Background>
                <BackButton goBack={navigation.goBack} />
                <Logo />
                <Header>Cambiar contraseña</Header>
                <TextInput
                        label="Nueva Contraseña"
                        returnKeyType="done"
                        value={password.value}
                        onChangeText={(text) => setPassword({ value: text, error: '' })}
                        error={!!password.error}
                        errorText={password.error}
                        secureTextEntry
                />
                <TextInput
                    label="Repite la Contraseña"
                    returnKeyType="done"
                    value={password2.value}
                    onChangeText={(text) => setPassword2({ value: text, error: '' })}
                    //onChangeText={(text) => checkPasswords(text)}
                    error={!!password2.error}
                    errorText={password2.error}
                    secureTextEntry
                />
                {errorMessage.error &&
                  (
                    <Paragraph style={{ color: 'red' }}>
                      {errorMessage.error}
                  </Paragraph>
                  )
                }
                <Button
                    mode="contained"
                    onPress={changePassword}
                    style={{ marginTop: 16 }}
                    > Cambiar Contraseña
                </Button>
        
        </Background>
    )
}