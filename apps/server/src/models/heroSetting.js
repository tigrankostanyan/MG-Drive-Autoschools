module.exports = (sequelize, DataTypes) => {
  const HeroSetting = sequelize.define(
    "HeroSetting",
    {
      title: { type: DataTypes.STRING, defaultValue: "Վարորդական իրավունք հեշտ ու վստահ" },
      subtitle: { type: DataTypes.TEXT, defaultValue: "Տեսական խմբեր, քննական թեստեր և գործնական վարման դասեր՝ ժամանակակից մոտեցմամբ: Մենք կօգնենք ձեզ դառնալ վստահ վարորդ:" },
      primary_button_text: { type: DataTypes.STRING, defaultValue: "Սկսել հիմա" },
      secondary_button_text: { type: DataTypes.STRING, defaultValue: "Ներբեռնել հավելվածը" },
      stat_students_value: { type: DataTypes.STRING, defaultValue: "1248+" },
      stat_students_label: { type: DataTypes.STRING, defaultValue: "Ավարտած ուսանողներ մեզ մոտ" },
      stat_success_value: { type: DataTypes.STRING, defaultValue: "94%" },
      stat_success_label: { type: DataTypes.STRING, defaultValue: "Հաջողության ցուցանիշ" },
      stat_first_try_value: { type: DataTypes.STRING, defaultValue: "94%" },
      stat_first_try_label: { type: DataTypes.STRING, defaultValue: "ԱՌԱՋԻՆ ՓՈՐՁԻՑ" },
      stat_questions_value: { type: DataTypes.STRING, defaultValue: "1200+" },
      stat_questions_label: { type: DataTypes.STRING, defaultValue: "ՀԱՐՑԵՐԻ ԲԱԶԱՅՈՒՄ" },
      stat_experience_value: { type: DataTypes.STRING, defaultValue: "12" },
      stat_experience_label: { type: DataTypes.STRING, defaultValue: "ՏԱՐՎԱ ՓՈՐՁ" },
    },
    {
      tableName: "hero_settings",
      timestamps: true,
    }
  );

  return HeroSetting;
};
