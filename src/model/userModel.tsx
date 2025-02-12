class UserModel {
    username: string;
    email: string;
    mobile: string;
    password: string;
  
    constructor(user: Partial<UserModel> = {}) {
      this.username = user.username || "";
      this.email = user.email || "";
      this.mobile = user.mobile || "";
      this.password = user.password || "";
    }
  }
  
  export default UserModel;
  