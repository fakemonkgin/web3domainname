const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {
    let ethDaddy
    let deployer, owner1
    const NAME = "ETH Daddy"
    const SYMBOL = "ETHD"

    beforeEach(async() => {
      [deployer, owner1] = await ethers.getSigners()
      const ETHDaddy = await ethers.getContractFactory("ETHDaddy")
      ethDaddy = await ETHDaddy.deploy("ETH Daddy", "ETHD")

      const transaction = await ethDaddy.connect(deployer).list("gin.eth", tokens(1))
      await transaction.wait()
    })

    describe("deployment", () => {
      it("has a name", async() => {
         const result = await ethDaddy.name()
         expect(result).to.equal(NAME)
      })
  
      it("has a symbol", async() => {
         const result = await ethDaddy.symbol()
         expect(result).to.equal(SYMBOL)
      })

      it("sets the owner", async() => {
        const result = await ethDaddy.owner()
        expect(result).to.equal(deployer.address)
      })
    })

    describe("Domain", () => {
      it("Returns domain attributes", async() => {
        let domain = await ethDaddy.getDomains(1)
        expect(domain.name).to.be.equal("gin.eth")
        expect(domain.cost).to.be.equal(tokens(10))
        expect(domain.isOwned).to.be.equal(false)
      })
    })

    describe("Minting", () => {
      const ID = 1
      const AMOUNT = ethers.utils.parseUnits("10", "ether")

      beforeEach(async () => {
        const transaction = await ethDaddy.connect(owner1).mint(ID, {value: AMOUNT})
        await transaction.wait()
      })

      it("Updates the owner", async() => {
        const owner = await ethDaddy.ownerOf(ID)
        expect(owner).to.be.equal(owner1.address)
      })

      it("updates the contract balance", async() => {
        const result  = await ethDaddy.getBalance()
        expect(result).to.be.equal(AMOUNT)
      })
    })

})
