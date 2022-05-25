module.exports = (sequelize, Sequelize) => {
    const xmlModel = sequelize.define("xmlModel", {
      title: {
        type: Sequelize.STRING
      },
      post_name: {
        type: Sequelize.STRING
      },
      content_encoded: {
        type: Sequelize.STRING
      },
      post_status: {
        type: Sequelize.STRING
      },
      GUID: {
        type: Sequelize.STRING
      },
      post_type: {
        type: Sequelize.STRING
      },
      site_id: {
        type: Sequelize.INTEGER
      },
      created_date: {
        type: Sequelize.DATE
      },
      updated_date: {
        type: Sequelize.DATE
      },
      created_by: {
        type: Sequelize.STRING
      },
      updated_by: {
        type: Sequelize.STRING
      }
    });
    return xmlModel;
  };