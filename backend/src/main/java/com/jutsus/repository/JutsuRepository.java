package com.jutsus.repository;

import com.jutsus.entity.Jutsu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JutsuRepository extends JpaRepository<Jutsu, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);

    List<Jutsu> findAllByOrderByIdDesc();
}
