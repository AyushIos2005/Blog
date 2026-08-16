import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Link as LinkIcon, Pencil } from "lucide-react";
import { getMyProfile, getAllPosts } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { initials, gradientFor } from "../utils/format";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [profileRes, postsRes] = await Promise.allSettled([
          getMyProfile(),
          getAllPosts(),
        ]);
        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value.data.profile);
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
        if (postsRes.status === "fulfilled") {
          const mine = (postsRes.value.data.posts || []).filter(
            (p) => p.author?._id === user?.id
          );
          setPosts(mine);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="h-64 rounded-2xl bg-white border border-[var(--color-border)] animate-pulse" />
      </div>
    );
  }

  const likesTotal = posts.reduce((sum, p) => sum + (p.like?.length || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden mb-6">
        <div className="h-36 brand-gradient" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-[var(--color-brand-500)] flex items-center justify-center text-white text-2xl font-bold">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                initials(profile?.fullName || user?.username)
              )}
            </div>
            <Link
              to="/app/profile/edit"
              className="flex items-center gap-1.5 text-sm font-semibold border border-[var(--color-border)] rounded-xl px-4 py-2 hover:bg-[var(--color-app)]"
            >
              <Pencil size={14} /> Edit Profile
            </Link>
          </div>

          <h1 className="text-xl font-bold flex items-center gap-2">
            {profile?.fullName || user?.username}
          </h1>
          <p className="text-sm text-[var(--color-muted)]">@{user?.username}</p>

          {!hasProfile ? (
            <div className="mt-4 bg-[var(--color-app)] rounded-xl p-4 text-sm">
              <p className="font-medium mb-1">Complete your profile</p>
              <p className="text-[var(--color-ink-soft)] mb-3">
                Add a bio, profession, and photo so other developers know who you are.
              </p>
              <Link
                to="/app/profile/edit"
                className="inline-block brand-gradient text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Set up profile
              </Link>
            </div>
          ) : (
            <>
              {profile?.bio && <p className="text-sm mt-3 max-w-xl">{profile.bio}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--color-ink-soft)]">
                {profile?.currentProfession && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {profile.currentProfession}
                  </span>
                )}
                {profile?.socialMediaLinks && (
                  <span className="flex items-center gap-1.5 text-[var(--color-brand-600)]">
                    <LinkIcon size={14} /> {profile.socialMediaLinks}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-[var(--color-border)] text-sm">
            <span>
              <strong>{posts.length}</strong>{" "}
              <span className="text-[var(--color-muted)]">Posts</span>
            </span>
            <span>
              <strong>{likesTotal}</strong>{" "}
              <span className="text-[var(--color-muted)]">Likes received</span>
            </span>
          </div>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Your Posts</h2>
      {posts.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 text-center text-sm text-[var(--color-ink-soft)]">
          You haven't published anything yet.{" "}
          <Link to="/app/create" className="text-[var(--color-brand-600)] font-semibold">
            Write your first post
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {posts.map((p) => (
            <Link
              key={p._id}
              to={`/app/post/${p._id}`}
              className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-white card-shadow"
            >
              <div className="h-28" style={{ background: gradientFor(p._id) }}>
                {p.file?.[0] && (
                  <img src={p.file[0]} alt={p.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold line-clamp-2">{p.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
