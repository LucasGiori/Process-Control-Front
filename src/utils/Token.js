import jwt_decode from "jwt-decode";
const TOKEN = 'token-processcontrol';
class Token {

    static getToken() {
        return window.localStorage.getItem(TOKEN);
    }

    static decodeTokenApi() {
        const token = Token.getToken();
        try {
            return token ? jwt_decode(token) : null;
        } catch(error) {
            Token.removeToken();
            window.location.reload();
            return null;
        }
    }

    static infoToken()  {
        const dataToken = this.decodeTokenAPI();
    
        if (dataToken && dataToken.info) {
          return JSON.parse(dataToken.info);
        }
    
        window.history.push('/#/login');
    
        return null;
      }
    
      static setToken = (token) => {
        window.localStorage.setItem(TOKEN, token);
      };
    
      static removeToken = () => {
        localStorage.removeItem(TOKEN);
        window.history.push('/#/login');
      };
    
}

export default new Token();