import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon ya existe en db ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log('Error fue=>', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(id: string) {
    let pokemon: Pokemon;
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.toLowerCase() });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon con id, name or no ${id} no encontrado`,
      );
    }

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      
    }
   await pokemon.updateOne(updatePokemonDto, {
      new: true,
    });
    return {...pokemon.toJSON(), ...updatePokemonDto};
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
