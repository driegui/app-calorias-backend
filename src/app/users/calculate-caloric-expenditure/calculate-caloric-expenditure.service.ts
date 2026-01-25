import { Injectable } from '@nestjs/common';
import { Gender } from '../enums/gender.enum';
import { ActivityLevel } from '../enums/activity-level.enum';
import { CalculateCaloricExpenditureDto } from '../dto/calculate-caloric-expenditure.dto';

@Injectable()
export class CalculateCaloricExpenditureService {
  /**
   * Calcula o gasto calórico diário usando a Equação de Mifflin-St Jeor
   * 
   * Fórmula TMB (Taxa Metabólica Basal):
   * - Masculino: TMB = (10 × Peso) + (6.25 × Altura) - (5 × Idade) + 5
   * - Feminino: TMB = (10 × Peso) + (6.25 × Altura) - (5 × Idade) - 161
   * 
   * GET (Gasto Energético Total) = TMB × PAL (Physical Activity Level)
   * - Sedentário: PAL 1.2
   * - Ativo: PAL 1.55
   * - Muito Ativo: PAL 1.725
   */
  execute(dto: CalculateCaloricExpenditureDto): {
    bmr: number; // Taxa Metabólica Basal (gasto passivo)
    tdee: number; // Gasto Energético Total Diário
    activityFactor: number;
  } {
    const { weight, height, age, gender, activityLevel } = dto;

    // Passo 1: Calcular TMB usando Mifflin-St Jeor
    const bmr = this.calculateBMR(weight, height, age, gender);

    // Passo 2: Obter fator de atividade (PAL)
    const activityFactor = this.getActivityFactor(activityLevel);

    // Passo 3: Calcular TDEE (Total Daily Energy Expenditure)
    const tdee = Math.round(bmr * activityFactor);

    return {
      bmr: Math.round(bmr),
      tdee,
      activityFactor,
    };
  }

  /**
   * Calcula a Taxa Metabólica Basal usando a Equação de Mifflin-St Jeor
   */
  private calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: Gender,
  ): number {
    // Componentes comuns da equação
    const weightComponent = 10 * weight;
    const heightComponent = 6.25 * height;
    const ageComponent = 5 * age;

    // Ajuste específico por gênero
    const genderAdjustment = gender === Gender.MALE ? 5 : -161;

    // TMB = (10 × Peso) + (6.25 × Altura) - (5 × Idade) + Ajuste_Gênero
    const bmr = weightComponent + heightComponent - ageComponent + genderAdjustment;

    return bmr;
  }

  /**
   * Retorna o fator de atividade física (PAL) baseado no nível de atividade
   * 
   * Fatores baseados em estudos de água duplamente marcada e recomendações da OMS
   */
  private getActivityFactor(activityLevel: ActivityLevel): number {
    const activityFactors: Record<ActivityLevel, number> = {
      [ActivityLevel.SEDENTARY]: 1.2, // Pouco ou nenhum exercício, trabalho de escritório
      [ActivityLevel.ACTIVE]: 1.55, // Exercício moderado 3-5 dias/semana
      [ActivityLevel.VERY_ACTIVE]: 1.725, // Exercício intenso 6-7 dias/semana ou trabalho físico pesado
    };

    return activityFactors[activityLevel];
  }
}
