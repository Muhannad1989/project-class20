const Profile = require('../../../models/Profile');

module.exports = deleteEducation = async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    const removeIndex = foundProfile.education
      .map(edu => edu._id.toString())
      .indexOf(req.params.edu_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: 'Server error' });
    } else {
      foundProfile.education.splice(removeIndex, 1);
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};
