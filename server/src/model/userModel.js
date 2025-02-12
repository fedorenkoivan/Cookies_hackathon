class UserModel {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.mobile = user.mobile;
    this.password = user.password;
    this.userType=user.userType;
  }
}
export default UserModel;