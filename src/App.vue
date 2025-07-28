<template>
  <div>
    <nav><router-link to="/">Login</router-link></nav>
    <nav>
      <router-link to="/movimentacao-financeira"
        >Movimentação Financeira</router-link
      >
    </nav>
    <nav>
      <router-link to="/modelagem-financeira">Modelagem Financeira</router-link>
    </nav>
    <router-view />
  </div>
</template>
