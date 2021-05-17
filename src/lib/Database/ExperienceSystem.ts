export class ExperienceSystem {

    getExperience(level: number) {
        
        if(level >= 32) {
            return ( (9 * level * level) - (325 * level) + 4440 ) / 2;
        }
        else if(level >= 17) {
            return ( (5 * level * level) - (81 * level) + 720 ) / 2;
        }
        else if(level >= 0) {
            return ( (level * level) + (6 * level) );
        }
    }
}