import "../styles/Profile.scss";
import "../styles/QuestCard.scss";
import QuestCard from "./QuestCard";
import StarRating from "./StarRating";


const Profile = () => {

  const userRating = 4.5;

  return (
    <section className="profile">
      <h2 className="profile__text">My profile</h2>
      <div className="profile__block">
        <div className="profile__top">
          <img
            className="profile__photo"
            src="src/assets/profile_photo_default.png"
            alt="Profile"
          />
          <div className="profile__info">
            <div className="profile__rating_stars">
              <StarRating rating={userRating} />
            </div>
            <h3 className="profile__name">Name Surname</h3>
          </div>
        </div>
        <p className="profile__biography">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          ligula odio, ultricies eget vestibulum et, euismod a enim. Vestibulum
          efficitur nibh leo, at auctor nisi dictum quis. Morbi aliquet feugiat
          arcu sed ultricies. Quisque eleifend vitae ligula sit amet rutrum.
          Vivamus magna ante, dapibus quis mollis sit amet, interdum non nisi.
        </p>
      </div>

      <h2 className="profile__text">All Name's quests:</h2>
      <div className="profile__block">
        <div className="quests__cards">
          <QuestCard />
        </div>
      </div>

      <h2 className="profile__text">History of Name's quests:</h2>
      <div className="profile__block">
        <div className="quests__cards">
          <QuestCard />
        </div>
      </div>
    </section>
  );
};

export default Profile;