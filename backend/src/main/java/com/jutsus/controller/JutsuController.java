package com.jutsus.controller;

import com.jutsus.dto.JutsuRequest;
import com.jutsus.entity.Jutsu;
import com.jutsus.entity.NaturezaChakra;
import com.jutsus.entity.RankJutsu;
import com.jutsus.service.JutsuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jutsus")
@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8081",
        "http://127.0.0.1:8081"
})
public class JutsuController {

    private final JutsuService service;

    public JutsuController(JutsuService service) {
        this.service = service;
    }

    @GetMapping
    public List<Jutsu> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String natureza,
            @RequestParam(required = false) String rank) {
        return service.listar(busca, natureza, rank);
    }

    @GetMapping("/{id}")
    public Jutsu buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Jutsu> criar(@Valid @RequestBody JutsuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @PutMapping("/{id}")
    public Jutsu atualizar(
            @PathVariable Long id,
            @Valid @RequestBody JutsuRequest request) {
        return service.atualizar(id, request);
    }

    @GetMapping("/opcoes/naturezas")
    public List<Map<String, String>> naturezas() {
        return List.of(
                Map.of("valor", NaturezaChakra.FOGO.name(), "nome", "Fogo"),
                Map.of("valor", NaturezaChakra.AGUA.name(), "nome", "Água"),
                Map.of("valor", NaturezaChakra.VENTO.name(), "nome", "Vento"),
                Map.of("valor", NaturezaChakra.TERRA.name(), "nome", "Terra"),
                Map.of("valor", NaturezaChakra.RAIO.name(), "nome", "Raio")
        );
    }

    @GetMapping("/opcoes/ranks")
    public List<String> ranks() {
        return List.of(
                RankJutsu.S.name(),
                RankJutsu.A.name(),
                RankJutsu.B.name(),
                RankJutsu.C.name(),
                RankJutsu.D.name()
        );
    }
}
