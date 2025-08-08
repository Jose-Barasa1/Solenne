'use client';

import { useEffect, useState } from 'react';
import { User, Pencil, Save, UploadCloud, KeyRound, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
   fetch('/api/user')
      .then(res => {
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          bio: res.data.bio || ''
        });
        setProfilePic(res.data.profile_pic);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put('/api/user', formData);
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Error saving changes');
    }
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('profile_pic', file);
    try {
      const res = await axios.post('/api/user/profile-pic', data);
      setProfilePic(res.data.url);
    } catch (err) {
      console.error('Profile picture upload failed');
    }
  };

  const changePassword = async () => {
    if (!password || password !== confirmPassword) {
      alert('Passwords must match and not be empty.');
      return;
    }
    try {
      await axios.post('/api/user/change-password', { password });
      alert('Password changed successfully');
      setPassword('');
      setConfirmPassword('');
    } catch {
      alert('Failed to change password');
    }
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This is irreversible.')) return;
    try {
      await axios.delete('/api/user');
      router.push('/goodbye');
    } catch {
      alert('Account deletion failed');
    }
  };

  return (
    <div className="p-6 text-white space-y-10">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <User /> Profile
      </h2>

      <div className="bg-purple-900 p-6 rounded-lg shadow-lg space-y-4">
        <div className="flex items-center gap-4">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-16 h-16 rounded-full" />
          ) : (
            <User className="w-16 h-16 text-purple-300" />
          )}
          <label className="text-sm text-purple-300 cursor-pointer flex items-center gap-1">
            <UploadCloud /> Change
            <input type="file" accept="image/*" className="hidden" onChange={handlePicUpload} />
          </label>
        </div>

        <div className="space-y-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!editing}
            className="bg-purple-800 w-full p-2 rounded-lg text-white"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!editing}
            className="bg-purple-800 w-full p-2 rounded-lg text-white"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!editing}
            className="bg-purple-800 w-full p-2 rounded-lg text-white"
            rows={3}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex gap-4 mt-4">
          {editing ? (
            <button onClick={saveChanges} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
              <Save /> Save
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              <Pencil /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-purple-900 p-6 rounded-lg shadow-lg space-y-3">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <KeyRound /> Change Password
        </h3>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-purple-800 w-full p-2 rounded-lg text-white"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-purple-800 w-full p-2 rounded-lg text-white"
        />
        <button
          onClick={changePassword}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mt-2"
        >
          Update Password
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-red-400 flex items-center gap-2">
          <Trash2 /> Delete Account
        </h3>
        <p className="text-sm text-purple-300 mt-2">This action is permanent and cannot be undone.</p>
        <button
          onClick={deleteAccount}
          className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Delete My Account
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-purple-300"
      >
        Your profile information is private and secure.
      </motion.div>
    </div>
  );
}
