export default class AudioHelper {
    public static effectVolume = 1;
    public static musicVolume = 1;
    public static playMusic = cc.audioEngine.playMusic.bind(cc.audioEngine);
    public static resumeMusic = cc.audioEngine.resumeMusic.bind(cc.audioEngine);
    public static pauseMusic = cc.audioEngine.pauseMusic.bind(cc.audioEngine);
    public static stopMusic = cc.audioEngine.stopMusic.bind(cc.audioEngine); //Pass true to release music

    public static playEffect = cc.audioEngine.playEffect.bind(cc.audioEngine);
    public static resumeEffect = cc.audioEngine.resumeEffect.bind(cc.audioEngine);
    public static pauseEffect = cc.audioEngine.pauseEffect.bind(cc.audioEngine);
    public static pauseAllEffects = cc.audioEngine.pauseAllEffects.bind(cc.audioEngine);
    public static unloadEffect = cc.audioEngine.unloadEffect.bind(cc.audioEngine);

    public static changeMusicVolume(val) {
        //if val is true increase volume
        //if val is false decrease volume
        //if val is num between 0 to 1 set that as volume
        if (val == true) {
            AudioHelper.musicVolume += 0.1;
            if (AudioHelper.musicVolume > 1.0) {
                AudioHelper.musicVolume = 1.0;
            }
        } else if (val == false) {
            AudioHelper.musicVolume -= 0.1;
            if (AudioHelper.musicVolume < 0) {
                AudioHelper.musicVolume = 0;
            }
        } else if (val >= 0 && val <= 1) {
            AudioHelper.musicVolume = val;
            //AudioHelper.musicVolume = 0;
        }
        cc.audioEngine.setMusicVolume(AudioHelper.musicVolume);
    };
    public static changeEffectVolume(val) {
        if (val == true) {
            AudioHelper.effectVolume += 0.1;
            if (AudioHelper.effectVolume > 1.0) {
                AudioHelper.effectVolume = 1.0;
            }
        } else if (val == false) {
            AudioHelper.effectVolume -= 0.1;
            if (AudioHelper.effectVolume < 0) {
                AudioHelper.effectVolume = 0;
            }
        } else if (val >= 0 && val <= 1) {
            AudioHelper.effectVolume = val;
            //AudioHelper.effectVolume = 0;
        }
        cc.audioEngine.setEffectsVolume(AudioHelper.effectVolume);
    };

    public static mute() {
        cc.audioEngine.setEffectsVolume(0);
        cc.audioEngine.setMusicVolume(0);
    };
    public static unmute() {
        cc.audioEngine.setEffectsVolume(AudioHelper.effectVolume);
        cc.audioEngine.setMusicVolume(AudioHelper.musicVolume);
    }
}