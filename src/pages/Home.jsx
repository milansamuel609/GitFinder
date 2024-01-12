import React, { useEffect, useState } from "react";
// import CreatePost from "../components/posts/CreatePost";
// import Post from "../components/posts/Post";
import Sidebar from "../Components/Sidebar";
// import ProfileCard from "../components/ProfileCard";
// import NoPost from "../components/posts/NoPost";
import db from "../firebase";
import { useNavigate } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import CreatePost from "../Components/post/CreatePost";
import Post from "../Components/post/Post";
// import useProtectedRoute from "../hooks/useProtectedRoute";

export default function Home() {
  // useProtectedRoute();
  const [userData, setUserData] = useState([]);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cookie = document.cookie;
  const fetchData = async () => {
    const response = await fetch(`https://api.github.com/users/${cookie}`);
    const data = await response.json();
    return setUserData(data);
  };
  useEffect(() => {
    fetchData();
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPost(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    })
  },[]);

  useEffect(()=>{
    if(!cookie){
      navigate('/login');
    }
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
    },1000)
  },[]);
  return (
    <>
      <div className="flex  gap-64 flex-col justify-center md:flex-row bg-[#1B2430] h-auto min-h-screen md:px-40">
       <div>
       <Sidebar />
       </div>
        <div className="md:w-7/12 m-3 ml-0 md:m-3 text-white px-4 py-1 rounded-2xl md:ml-14">
          <CreatePost
            avatar={userData.avatar_url}
            login={userData.login}
            name={userData.name}
            bio={userData.bio}
          />
          {loading ? (
            <div className="w-full flex justify-center items-center animate-spin h-96">
              <VscLoading className="w-8 h-8" />
            </div>
          ) : (
            post.map(
              ({
                id,
                data: {
                  logo,
                  name,
                  username,
                  bio,
                  like,
                  likedBy,
                  commentCnt,
                  commentObj,
                  description,
                },
              }) => {
                return (
                  <Post
                    key={id}
                    logo={logo}
                    name={name}
                    username={username}
                    like={like}
                    likedBy={likedBy}
                    commentCnt={commentCnt}
                    commentObj={commentObj}
                    bio={bio}
                    description={description}
                    width={"full"}
                  />
                );
              }
            )
          )}
        </div>
      </div>
    </>
  );
}