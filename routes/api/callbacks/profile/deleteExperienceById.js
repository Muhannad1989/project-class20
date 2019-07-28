const Profile = require('../../../../models/Profile');

module.exports = deleteExperienceById = async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    const removeIndex = foundProfile.experience
      .map(exp => exp._id.toString())
      .indexOf(req.params.exp_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: 'Server error' });
    } else {
      foundProfile.experience.splice(removeIndex, 1);
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};
