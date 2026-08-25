



import type { ArenaQuestion } from "@/components/arena/Arena";

// Biology questions
import varietyOfOrganismsQuestions from "@/data/questions/Biology/01-VarietyOfOrganisms";
import evolutionAndAdaptationQuestions from "@/data/questions/Biology/02-EvolutionAndAdaptation";
import levelsOfOrganizationQuestions from "@/data/questions/Biology/04-LevelsOfOrganization";
import cellStructureAndFunctionsQuestions from "../questions/Biology/03-CellStructureAndFunctions";
import livingProcessesQuestions from "../questions/Biology/05-LivingProcesses";
import supportAndMovementQuestions from "../questions/Biology/06-SupportAndMovement";
import nutritionQuestions from "../questions/Biology/07-Nutrition";
import transportSystemQuestions from "../questions/Biology/08-TransportSystem";
import excretionQuestions from "../questions/Biology/10-Excretion";
import respirationQuestions from "../questions/Biology/09-Respiration";
import homeostasisQuestions from "../questions/Biology/11-Homeostasis";
import reproductionQuestions from "../questions/Biology/13-Reproduction";
import growthAndDevelopmentQuestions from "../questions/Biology/14-GrowthAndDevelopment";
import geneticsAndHeredityQuestions from "../questions/Biology/15-GeneticsAndHeredity";
import ecologyQuestions from "../questions/Biology/16-Ecology";
import interdependenceOfOrganismsQuestions from "../questions/Biology/17-InterdependenceOfOrganisms";
import populationStudiesQuestions from "../questions/Biology/18-PopulationStudies";
import environmentalBiologyQuestions from "../questions/Biology/20-EnvironmentalBiology";
import healthAndDiseaseQuestions from "../questions/Biology/21-HealthAndDisease";
import applicationOfBiologyQuestions from "../questions/Biology/22-ApplicationOfBiology";

import measurementsAndUnitsQuestions from "../questions/Physics/01-MeasurementsAndUnits";
import scalarsAndVectorsQuestions from "../questions/Physics/02-ScalarsAndVectors";
import motionQuestions from "../questions/Physics/03-Motion";
import equilibriumOfForcesQuestions from "../questions/Physics/05-EquilibriumOfForces";
import workEnergyAndPowerQuestions from "../questions/Physics/06-WorkEnergyAndPower";
import simpleMachinesQuestions from "../questions/Physics/07-SimpleMachines";
import pressureQuestions from "../questions/Physics/09-Pressure";
import temperatureAndThermalExpansionQuestions from "../questions/Physics/11-TemperatureAndThermalExpansion";
import gasLawsQuestions from "../questions/Physics/13-GasLaws";
import changeOfStateQuestions from "../questions/Physics/14-ChangeOfState";
import wavesQuestions from "../questions/Physics/15-Waves";
import soundWavesQuestions from "../questions/Physics/16-SoundWaves";
import gravitationalFieldQuestions from "../questions/Physics/04-GravitationalField";
import elasticityQuestions from "../questions/Physics/08-Elasticity";
import liquidsAtRestAndInMotionQuestions from "../questions/Physics/10-LiquidsAtRestAndInMotion";
import lightWavesQuestions from "../questions/Physics/17-LightWaves";
import electricFieldsQuestions from "../questions/Physics/18-ElectricFields";
import electricCurrentQuestions from "../questions/Physics/19-ElectricCurrent";
import magnetsAndMagneticFieldsQuestions from "../questions/Physics/21-MagnetsAndMagneticFields";
import electromagneticInductionQuestions from "../questions/Physics/22-ElectromagneticInduction";
import electromagneticWavesQuestions from "../questions/Physics/23-ElectromagneticWaves";
import nuclearPhysicsQuestions from "../questions/Physics/25-NuclearPhysics";
import electronicsQuestions from "../questions/Physics/26-Electronics";
import physicsInTechnologyQuestions from "../questions/Physics/27-PhysicsInTechnology";
import atomicPhysicsQuestions from "../questions/Physics/24-AtomicPhysics";
import electricalEnergyAndPowerQuestions from "../questions/Physics/20-ElectricalEnergyAndPower";
// --------------------------------------------------------------------------
// TYPES
// --------------------------------------------------------------------------

export interface TopicConfig {
  name: string;
  questions: ArenaQuestion[];
}

export interface SubjectConfig {
  name: string;
  topics: TopicConfig[];
}

// --------------------------------------------------------------------------
// SUBJECTS
// --------------------------------------------------------------------------

export const SUBJECTS: SubjectConfig[] = [
  {
    name: "Biology",

    topics: [
      {
        name: "Variety of Organisms",
        questions: varietyOfOrganismsQuestions,
      },

      {
        name: "Evolution and Adaptation",
        questions: evolutionAndAdaptationQuestions,
      },

      {
        name: "Cell Structure and Functions",
        questions: cellStructureAndFunctionsQuestions,
      },

      {
  name: "Levels of Organization",
  questions: levelsOfOrganizationQuestions,
     },

     {
  name: "Living Processes",
  questions: livingProcessesQuestions,
},
{
      name: "Support and Movement",
      questions: supportAndMovementQuestions,
    },

      {
        name: "Nutrition",
        questions: nutritionQuestions,
      },

      {
  name: "Excretion",
  questions: excretionQuestions,
},

{
  name: "Respiration",
  questions: respirationQuestions,
},

{
  name: "Homeostasis",
  questions: homeostasisQuestions,
},

{
  name: "Growth and Development",
  questions: growthAndDevelopmentQuestions,
},

{
  name: "Genetics and Heredity",
  questions: geneticsAndHeredityQuestions,
},

{
  name: "Interdependence of Organisms",
  questions: interdependenceOfOrganismsQuestions,
},

{
  name: "Population Studies",
  questions: populationStudiesQuestions,
},

{
  name: "Environmental Biology",
  questions: environmentalBiologyQuestions,
},

{
  name: "Health and Disease",
  questions: healthAndDiseaseQuestions,
},

{
  name: "Application of Biology",
  questions: applicationOfBiologyQuestions,
},

     

      {
        name: "Ecology",
        questions: ecologyQuestions,
      },

      {
        name: "Reproduction",
         questions: reproductionQuestions,
      },

    

      {
  name: "Transport System",
  questions: transportSystemQuestions,
},
    ],
  },

  // --------------------------------------------------------------------------
// SUBJECTS
// --------------------------------------------------------------------------


  {
    name: "Physics",

    topics: [
      {
        name: "Measurements and Units",
        questions: measurementsAndUnitsQuestions,
      },

      {
        name: "Scalars and Vectors",
        questions: scalarsAndVectorsQuestions,
      },

      {
        name: "Motion",
        questions: motionQuestions,
      },

     {
        name: "Gravitational",
        questions: gravitationalFieldQuestions,
      },

      {
        name: "Forces",
        questions: equilibriumOfForcesQuestions,
      },

      {
        name: "Work, Energy and Power",
        questions: workEnergyAndPowerQuestions,
      },

      {
        name: "Machines",
        questions: simpleMachinesQuestions,
      },

      {
        name: "Elasticity",
        questions: elasticityQuestions,
      },

      {
        name: "Pressure",
        questions: pressureQuestions,
      },

       {
        name: "Liquids",
        questions: liquidsAtRestAndInMotionQuestions,
      },

     {
        name: "Temperature And ThermalExpansion",
        questions: temperatureAndThermalExpansionQuestions,
      },

      {
        name: "Thermal Expansion",
        questions: temperatureAndThermalExpansionQuestions,
      },

      {
        name: "Gas Laws",
        questions: gasLawsQuestions,
      },

      {
  name: "Change of State",
  questions: changeOfStateQuestions,
},

      {
        name: "Waves",
        questions: wavesQuestions,
      },

      {
        name: "Sound Waves",
        questions: soundWavesQuestions,
      },

      {
        name: "Light Waves",
        questions: lightWavesQuestions,
      },

      {
        name: "Electric Fields",
        questions: electricFieldsQuestions,
      },

      {
        name: "ElectricalEnergy And Power",
        questions: electricalEnergyAndPowerQuestions,
      },


       {
        name: "Electric Current",
        questions: electricCurrentQuestions,
      },


      {
        name: "Magnets And MagneticField",
        questions: magnetsAndMagneticFieldsQuestions,
      },

      {
        name: "Electromagnetic Induction",
        questions: electromagneticInductionQuestions,
      },
 

       {
        name: "AtomicPhysics",
        questions: atomicPhysicsQuestions,
      },

      {
        name: "Electromagnetic Waves",
        questions: electromagneticWavesQuestions,
      },

    
      {
        name: "Nuclear Physics",
        questions: nuclearPhysicsQuestions,
      },


       {
        name: "Electronics",
        questions: electronicsQuestions,
      },


      {
        name: "Physics In Technology",
        questions: physicsInTechnologyQuestions,
      },
    ],
  },
];